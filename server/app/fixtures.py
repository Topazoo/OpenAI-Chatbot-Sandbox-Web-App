# Default database entries
from openai_client import CHAT_MODELS

FIXTURES = {
    'config': [
        {
            "_id" : "62c28f6e955bb66a95e3afbc",
            "name" : "ALLOW_NEW_USER_SIGNUPS",
            "value" : False
        },
        {
            "_id" : "62c28f6e955bb66a95e3afbe",
            "name" : "BASE_MODEL",
            "value" : CHAT_MODELS.GPT_3_5_TURBO
        }
    ]
}