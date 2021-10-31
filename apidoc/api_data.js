define({ "api": [
  {
    "type": "post",
    "url": "/auth",
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
    "filename": "/home/babouliin/tek5/js-project/back-modulejs/node_modules/koa-smart/dist/ApiDocTmp/-auth.js",
    "groupTitle": "Auth",
    "name": "PostAuth"
  },
  {
    "type": "get",
    "url": "/user/:email",
    "title": "",
    "group": "User",
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
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/babouliin/tek5/js-project/back-modulejs/node_modules/koa-smart/dist/ApiDocTmp/-user--email.js",
    "groupTitle": "User",
    "name": "GetUserEmail"
  },
  {
    "type": "get",
    "url": "/user/:pseudo",
    "title": "",
    "group": "User",
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
            "field": "pseudo",
            "description": "<p>It should be a string.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "/home/babouliin/tek5/js-project/back-modulejs/node_modules/koa-smart/dist/ApiDocTmp/-user--pseudo.js",
    "groupTitle": "User",
    "name": "GetUserPseudo"
  },
  {
    "type": "post",
    "url": "/user",
    "title": "",
    "group": "User",
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
    "filename": "/home/babouliin/tek5/js-project/back-modulejs/node_modules/koa-smart/dist/ApiDocTmp/-user.js",
    "groupTitle": "User",
    "name": "PostUser"
  }
] });
