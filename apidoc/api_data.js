define({ "api": [
  {
    "type": "post",
    "url": "/auth/login",
    "title": "",
    "group": "Auth",
    "permission": [
      {
        "name": "public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>It should be a string.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>It should be a string.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/babouliin/tek5/js-project/Back-modulejs/node_modules/koa-smart/dist/ApiDocTmp/-auth-login.js",
    "groupTitle": "Auth",
    "name": "PostAuthLogin"
  },
  {
    "type": "post",
    "url": "/auth/signup",
    "title": "",
    "group": "Auth",
    "permission": [
      {
        "name": "public"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>It should be a string.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pseudo",
            "description": "<p>It should be a string.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>It should be a string.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/babouliin/tek5/js-project/Back-modulejs/node_modules/koa-smart/dist/ApiDocTmp/-auth-signup.js",
    "groupTitle": "Auth",
    "name": "PostAuthSignup"
  },
  {
    "type": "get",
    "url": "/chats",
    "title": "",
    "group": "Chat",
    "permission": [
      {
        "name": "isConnected"
      }
    ],
    "version": "0.0.0",
    "filename": "/home/babouliin/tek5/js-project/Back-modulejs/node_modules/koa-smart/dist/ApiDocTmp/-chats.js",
    "groupTitle": "Chat",
    "name": "GetChats"
  },
  {
    "type": "get",
    "url": "/",
    "title": "",
    "group": "Index",
    "permission": [
      {
        "name": "public"
      }
    ],
    "version": "0.0.0",
    "filename": "/home/babouliin/tek5/js-project/Back-modulejs/node_modules/koa-smart/dist/ApiDocTmp/Index.js",
    "groupTitle": "Index",
    "name": "Get"
  },
  {
    "type": "get",
    "url": "/messages",
    "title": "",
    "group": "Message",
    "permission": [
      {
        "name": "isConnected"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "chatId",
            "description": "<p>It should be a string.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/babouliin/tek5/js-project/Back-modulejs/node_modules/koa-smart/dist/ApiDocTmp/-messages.js",
    "groupTitle": "Message",
    "name": "GetMessages"
  },
  {
    "type": "get",
    "url": "/users",
    "title": "",
    "group": "User",
    "permission": [
      {
        "name": "isConnected"
      }
    ],
    "version": "0.0.0",
    "filename": "/home/babouliin/tek5/js-project/Back-modulejs/node_modules/koa-smart/dist/ApiDocTmp/-users.js",
    "groupTitle": "User",
    "name": "GetUsers"
  },
  {
    "type": "put",
    "url": "/user",
    "title": "",
    "group": "User",
    "permission": [
      {
        "name": "isConnected"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "pseudo",
            "description": "<p>It should be a string.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>It should be a string.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/babouliin/tek5/js-project/Back-modulejs/node_modules/koa-smart/dist/ApiDocTmp/-user.js",
    "groupTitle": "User",
    "name": "PutUser"
  }
] });
