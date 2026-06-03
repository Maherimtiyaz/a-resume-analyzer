from sklearn.metrics.pairwise import cosine_similarity

def compute_similarity(resume_vector, job_vector) -> float:
    """
    Expects resume_vector and job_vector to be 2D sparse or dense vectors.
    Returns a float in [0,1] rounded to 3 decimals.
    """
    sim = cosine_similarity(resume_vector, job_vector)
    # sim is a matrix; for single pair it's shape (1,1)
    try:
        value = float(sim[0][0])
    except Exception:
        value = 0.0
    if value != value:  # NaN safety
        value = 0.0
    return round(value, 3)
