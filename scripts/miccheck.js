$(function () {
	"use strict";

	var articles = 'assets/articles.json';
	var moreArticles = 'assets/more-articles.json';

	var articlesShown = [];
	var articlesStore = [];

	var tableBody = '.article-table-body';

	var tableState = {
		show: 10,
		additional: false,
		isDone: false
	};

	/**
	*
	* Load articles from file and store them
	*
	*/
	function loadArticles (filename) {
		if (!filename) {
			filename = (!tableState.additional) ? articles : moreArticles;
		}
		$(tableBody).addClass('loading');
		$.getJSON(filename, function (json) {
			articlesStore = articlesStore.concat(json);
			filterArticles();
			appendArticles();
			checkIfDone();
			$(tableBody).removeClass('loading');
			$('.show-more > .button').removeClass('loading');
		}).fail(function() {
			$(tableBody)
				.html('Something went wrong loading the articles.')
				.removeClass('loading');
			$('.show-more > .button').removeClass('loading');
		});
	}

	function checkIfDone () {
		tableState.isDone = (articlesShown.length >= articles.length + moreArticles.length);
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
		$(tableBody).empty();
		$.each(articlesShown, function (i, article) {
			var oddOrEvenClass = (i % 2 === 0) ? 'even' : 'odd';
			var row = '<div class="article-row ' + oddOrEvenClass + '">';
			row += '<span class="cell">' + '<img width="50" height="50" src="' + article.image + '"/>';
			row += '<a href="' + article.url + '">' + article.title + '</a></span>';
			row += '<span class="cell">' + getFullName(article) + '</span>';
			row += '<span class="cell">' + article.words + '</span>';
			row += '<span class="cell">' + getTimeDelta(article) + '</span></div>';
			$(tableBody).append(row);
			$('.show-more > .button').removeClass('loading');
		});
	}

	/**
	*
	* Click handler for SHOW MORE
	*
	*/
	function showMore () {
		$('.show-more').click(function () {
			if (!tableState.isDone) {
				$(this).find('.button').addClass('loading');
				tableState.show += 10;
				if (tableState.show > articlesStore.length) {
					tableState.additional = true;
					loadArticles();
				} else {
					filterArticles();
					appendArticles();
				}				
			} else {
				$(this).find('.button')
					.html('No more articles')
					.addClass('disabled');
			}
		});
	}

	/**
	*
	* Run the thing!
	*
	*/
	loadArticles();
	showMore();
}());
