$(function () {
	"use strict";

	var filename = 'assets/articles.json';

	var articlesShown = [];
	var articlesStore = [];

	var tableState = {
		show: 10,
		additional: false
	};

	/**
	*
	* Load articles from file and store them
	*
	*/
	function loadArticles (filename) {
		$('.article-table-body').addClass('loading');
		$.getJSON(filename, function (json) {
			articlesStore = json;
			filterArticles();
			appendArticles();
		}).fail(function() {
			$(".article-table-body").html('Something went wrong loading the articles.');
		}).always(function () {
			$('.article-table-body').removeClass('loading');
			$('.show-more > .button').removeClass('loading');
		});
	}

	/**
	*
	* Filter articles to show based on the state
	*
	*/
	function filterArticles () {
		articlesShown = articlesStore.slice(0, tableState.show);
	}

	function getFullName (article) {
		var first = article.profile.first_name,
			last = article.profile.last_name;
		return first + ' ' + last;
	}

	function getTimeDelta (article) {
		return moment(article.publish_at, 'YYYY-MM-DD HH:mm:ss').fromNow();
	}

	/**
	*
	* Append articles to the container
	*
	*/
	function appendArticles () {
		$(".article-table-body").empty();
		$.each(articlesShown, function (i, article) {
			var oddOrEvenClass = (i % 2 === 0) ? 'even' : 'odd';
			var row = '<div class="article-row ' + oddOrEvenClass + '">';
			row += '<span class="cell">' + '<img width="50" height="50" src="' + article.image + '"/>';
			row += '<a href="' + article.url + '">' + article.title + '</a></span>';
			row += '<span class="cell">' + getFullName(article) + '</span>';
			row += '<span class="cell">' + article.words + '</span>';
			row += '<span class="cell">' + getTimeDelta(article) + '</span></div>';
			$(".article-table-body").append(row);
		});
	}

	/**
	*
	* Click handler for SHOW MORE
	*
	*/
	function showMore () {
		$('.show-more').click(function () {
			$(this).find('.button').addClass('loading');
			tableState.show += 10;
			if (tableState.show > articlesStore) {
				// load more files
			}
			filterArticles();
			appendArticles();
		});
	}

	/**
	*
	* Run the thing!
	*
	*/
	loadArticles(filename);
	showMore();
}());
