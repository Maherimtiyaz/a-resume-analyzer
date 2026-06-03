# app/services/batch_processor.py
from typing import List, Dict, Any
from concurrent.futures import ThreadPoolExecutor, as_completed
import logging
from datetime import datetime

from app.services.preprocessing import process_text
from app.services.matcher import compute_similarity

logger = logging.getLogger(__name__)


class BatchProcessor:
    """
    Process multiple resume-job pairs in parallel.
    """
    
    def __init__(self, max_workers: int = 4):
        self.max_workers = max_workers
    
    def process_batch(
        self,
        resumes: List[str],
        job_descriptions: List[str],
        vectorizer
    ) -> List[Dict[str, Any]]:
        """
        Process multiple resume-job pairs in parallel.
        
        Args:
            resumes: List of resume texts
            job_descriptions: List of job description texts (one per resume)
            vectorizer: Pre-trained vectorizer
            
        Returns:
            List of match results with scores and metadata
        """
        if len(resumes) != len(job_descriptions):
            raise ValueError(
                f"Mismatch: {len(resumes)} resumes vs {len(job_descriptions)} job descriptions"
            )
        
        results = []
        start_time = datetime.now()
        
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # Submit all tasks
            futures = {}
            for idx, (resume, job_desc) in enumerate(zip(resumes, job_descriptions)):
                future = executor.submit(
                    self._process_single_pair,
                    idx,
                    resume,
                    job_desc,
                    vectorizer
                )
                futures[future] = idx
            
            # Collect results as they complete
            for future in as_completed(futures):
                idx = futures[future]
                try:
                    result = future.result()
                    results.append(result)
                except Exception as e:
                    logger.error(f"Failed to process pair {idx}: {e}")
                    results.append({
                        "index": idx,
                        "success": False,
                        "error": str(e),
                        "match_score": 0.0
                    })
        
        # Sort by original index
        results.sort(key=lambda x: x["index"])
        
        elapsed = (datetime.now() - start_time).total_seconds()
        logger.info(f"Processed {len(results)} pairs in {elapsed:.2f}s")
        
        return results
    
    def _process_single_pair(
        self,
        index: int,
        resume: str,
        job_description: str,
        vectorizer
    ) -> Dict[str, Any]:
        """Process a single resume-job pair"""
        try:
            # Preprocess
            resume_clean = process_text(resume)
            job_clean = process_text(job_description)
            
            if not resume_clean or not job_clean:
                return {
                    "index": index,
                    "success": False,
                    "error": "Empty content after preprocessing",
                    "match_score": 0.0
                }
            
            # Vectorize
            resume_vec = vectorizer.transform([resume_clean])
            job_vec = vectorizer.transform([job_clean])
            
            # Compute similarity
            score = compute_similarity(resume_vec, job_vec)
            
            return {
                "index": index,
                "success": True,
                "match_score": score,
                "resume_tokens": len(resume_clean.split()),
                "job_tokens": len(job_clean.split())
            }
        
        except Exception as e:
            logger.error(f"Error processing pair {index}: {e}")
            raise


class MultiJobMatcher:
    """
    Match a single resume against multiple job descriptions.
    """
    
    def match_resume_to_jobs(
        self,
        resume: str,
        job_descriptions: List[str],
        vectorizer,
        top_k: int = None
    ) -> List[Dict[str, Any]]:
        """
        Match one resume against multiple jobs, return ranked results.
        
        Args:
            resume: Resume text
            job_descriptions: List of job description texts
            vectorizer: Pre-trained vectorizer
            top_k: Return only top K matches (None = all)
            
        Returns:
            List of matches sorted by score (highest first)
        """
        resume_clean = process_text(resume)
        if not resume_clean:
            raise ValueError("Resume has no meaningful content")
        
        resume_vec = vectorizer.transform([resume_clean])
        
        matches = []
        for idx, job_desc in enumerate(job_descriptions):
            try:
                job_clean = process_text(job_desc)
                if not job_clean:
                    continue
                
                job_vec = vectorizer.transform([job_clean])
                score = compute_similarity(resume_vec, job_vec)
                
                matches.append({
                    "job_index": idx,
                    "match_score": score,
                    "job_preview": job_desc[:100] + "..." if len(job_desc) > 100 else job_desc
                })
            except Exception as e:
                logger.error(f"Failed to match job {idx}: {e}")
                continue
        
        # Sort by score (highest first)
        matches.sort(key=lambda x: x["match_score"], reverse=True)
        
        # Return top K if specified
        if top_k:
            matches = matches[:top_k]
        
        return matches
