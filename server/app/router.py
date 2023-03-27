# Framework
from dead_simple_framework import Route, RouteHandler
from dead_simple_framework.handlers import UserRouteHandler, LoginRouteHandler, \
    DefaultPermissionsRouteHandler, Permissions, PermissionsRouteHandler

# Schemas
from schemas import USER_ROUTE_SCHEMA, AUTH_ROUTE_SCHEMA, CONFIG_ROUTE_SCHEMA, PASSWORD_RESET_ROUTE_SCHEMA

# Login Route Logic
from routes import login

# User Route Logic
from routes import users

# AI Route Logic
from routes import chatbot
from routes import chatlist

ROUTES = \
{
    # Healthcheck for AWS
    'healthcheck': Route(url='/', handler=RouteHandler(GET=lambda request, payload: "It's alive!")),

    # Authentication (Login/Logout)
    'authentication': Route(
        url='/api/authenticate', 
        handler=LoginRouteHandler(
            POST=login.POST
        ),
        collection='users',
        schema=AUTH_ROUTE_SCHEMA
    ),

    # User Management (Create, Update, Delete)
    'users': Route(
        url='/api/users',
        handler=DefaultPermissionsRouteHandler(
            POST=users.POST,
            PUT=UserRouteHandler.PUT,
            DELETE=UserRouteHandler.DELETE,
            verifier=UserRouteHandler.verifier,
            permissions=Permissions(PUT='USER', PATCH='USER', GET='USER', DELETE='USER')
        ), 
        collection='users',
        schema=USER_ROUTE_SCHEMA
    ),

    'chatbot': Route(
        url='/api/chatbot',
        handler=PermissionsRouteHandler(
            POST=chatbot.POST,
            GET=chatbot.GET,
            permissions=Permissions(POST=['USER'])
        ),
        collection='chats',
    ),

    'chatlist': Route(
        url='/api/chats',
        handler=PermissionsRouteHandler(
            GET=chatlist.GET,
            permissions=Permissions(POST=['USER'])
        ),
        collection='chats',
    ),

    # API-Modifiable Config
    'config': Route(
        url='/api/config',
        handler=DefaultPermissionsRouteHandler(permissions=Permissions(POST=['ADMIN'], PUT=['ADMIN'], DELETE=['ADMIN'], GET=['ADMIN'])),
        collection='config',
        schema=CONFIG_ROUTE_SCHEMA
    ),
}
