const Joi = require("joi");

module.exports.postSignUpValidate = (post) => {
  return Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    category: Joi.array().items(Joi.string()).required(),
  }).validate(post);
};
module.exports.postEditValidate = (post) => {
  return Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    image: Joi.string(),
    category: Joi.array().items(Joi.string()), 
  }).validate(post);
};
