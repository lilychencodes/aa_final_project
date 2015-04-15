NoPhenotype.Views.QuestionsIndex = Backbone.View.extend({

  template: JST["questions_index"],

  initialize: function() {
    this.listenTo(this.collection, "sync add remove", this.render);
    this.searchList = new NoPhenotype.Collections.Questions();
  },

  events: {
    "click button": "handleMatchedQ"
  },

  handleMatchedQ: function(event) {
    event.preventDefault();
    this.inputData = { "query": this.$(".search").val() };
    this.searchList.fetch({
      data: this.inputData,
      success: function(response) {
        this.renderMatchedQ();
      }.bind(this)
    });
    this.$(".search").val("");
  },

  renderMatchedQ: function() {
    this.$("ul.questions-index").empty();
    for (var i = 0; i < this.searchList.length; i++) {
      var questionIndexView = new NoPhenotype.Views.QuestionIndexItem({model: this.searchList.at(i)});
      this.$("ul.questions-index").append(questionIndexView.render().$el);

    }
  },

  render: function() {
    var content = this.template();
    this.$el.html(content);

    this.collection.each(function(question) {
      var indexItemView = new NoPhenotype.Views.QuestionIndexItem({
        model: question
      });
      this.$("ul.questions-index").append(indexItemView.render().$el);
    });
    this.listenForScroll();
    return this;
  },

  listenForScroll: function() {
    $(window).off("scroll"); // remove previous listeners
    var throttledCallback = _.throttle(this.nextPage.bind(this), 400);
    $(window).on("scroll", throttledCallback);
  },

  nextPage: function () {
    var view = this;
    if ($(window).scrollTop() > $(document).height() - $(window).height() - 50) {
      if (view.collection.page < view.collection.total_pages) {
        view.collection.fetch({
          data: this.inputData,
          data: { page: view.collection.page + 1 },
          //pass in this.inputData to data? don't want to keep scrolling to non-searched questions
          remove: false
        });
      }
    }
  }

});
