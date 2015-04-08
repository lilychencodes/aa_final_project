NoPhenotype.Models.Question = Backbone.Model.extend({
  urlRoot: "/api/questions",

  tags: function() {
    if (this._tags) {
      return this._tags;
    }
    this._tags = new NoPhenotype.Collections.Tags([], {question: this.model});
    return this._tags;
  },

  answers: function() {
    if (this._answers) {
      return this._answers;
    }
    this._answers = new NoPhenotype.Collections.Answers([], {question: this});
    return this._answers;
  },

  parse: function(response) {
    if (response.answers) {
      this.answers().set(response.answers, {parse: true});
      delete response.answers;
    }
    if (response.tags) {
      this.tags().set(response.tags);
      delete response.tags;
    }
    return response;
  }
});
