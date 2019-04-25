const { Model } = require ('objection');

class JavaScriptFrameworkMention extends Model {
  static get tableName () {
    return 'javascript_framework_mention';
  }
}

exports.JavaScriptFrameworkMention = JavaScriptFrameworkMention;
