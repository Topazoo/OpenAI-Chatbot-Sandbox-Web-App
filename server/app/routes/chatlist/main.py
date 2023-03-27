from dead_simple_framework.api import JsonError

# Typing
from flask import Request
from pymongo.collection import Collection, ObjectId

def GET(request:Request, payload:dict, collection:Collection):
    ''' Get all chats for a user '''

    user_id = payload.get('user_id')
    result = collection.find({"user_id": ObjectId(user_id)}, projection=["chat_name", "_id"])

    return {"data": list(result)}
