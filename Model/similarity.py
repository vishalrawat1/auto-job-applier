import logging
import transformers
from sentence_transformers import SentenceTransformer, util

# Suppress transformers load warnings for cleaner output
transformers.logging.set_verbosity_error()

model = SentenceTransformer('all-MiniLM-L6-v2')

s1 = "your name is "
s2 = "what is your name"

emb1 = model.encode(s1, convert_to_tensor=True)
emb2 = model.encode(s2, convert_to_tensor=True)

score = util.cos_sim(emb1, emb2)
print("Similarity:", score.item())
