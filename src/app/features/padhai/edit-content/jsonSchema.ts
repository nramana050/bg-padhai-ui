
export let jsonSchema = {
  
    "title": "Schema for Padhai course",
    "type": "object",
    "properties": {
      "courseRequestId": {
        "type": "number"
      },
      "modules": {
        "type": "array",
        "minItems": 5,
        "maxItems": 5,
        "items": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "minLength": 1
            },
            "summary": {
              "type": "string",
              "minLength": 1
            },
            "lessons": {
              "type": "array",
              "minItems": 4,
              "maxItems": 4,
              "items": {
                "type": "object",
                "properties": {
                  "title": {
                    "type": "string",
                    "minLength": 1
                  },
                  "summary": {
                    "type": "string",
                    "minLength": 1
                  },
                  "page": {
                    "type": "string",
                    "minLength": 1
                  },
                  "quiz": {
                    "type": "object",
                    "properties": {
                      "name": {
                        "type": "string",
                        "minLength": 1
                      },
                      "questions": {
                        "type": "array",
                        "minItems": 4,
                        "maxItems": 4,
                        "items": {
                          "type": "object",
                          "properties": {
                            "questionText": {
                              "type": "string",
                              "minLength": 1
                            },
                            "answers": {
                              "type": "array",
                              "minItems": 4,
                              "maxItems": 4,
                              "items": {
                                "type": "object",
                                "properties": {
                                  "text": {
                                    "type": "string",
                                    "minLength": 1
                                  },
                                  "feedback": {
                                    "type": "string",
                                    "minLength": 1
                                  }
                                },
                                "required": [
                                  "text",
                                  "feedback"
                                ]
                              }
                            }
                          },
                          "required": [
                            "questionText",
                            "answers"
                          ]
                        }
                      }
                    },
                    "required": [
                      "name",
                      "questions"
                    ]
                  }
                },
                "required": [
                  "title",
                  "summary",
                  "page",
                  "quiz"
                ]
              }
            }
          },
          "required": [
            "title",
            "summary",
            "lessons"
          ]
        }
      }
    },
    "required": [
      "courseRequestId",
      "modules"
    ]
  }