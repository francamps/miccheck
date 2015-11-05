$(function () {
	"use strict";

	var basePath = 'assets/data/';
	var articles = basePath + 'articles.json';
	var moreArticles = basePath + 'more-articles.json';

	var articlesStore = [];
	var articlesShown = [];

	var $tableBody = $('.article-table-body');
	var $showMore = $('.show-more > .button');

	var tableState = {
		show: 10,
		additionalFile: false,
		isDoneLoading: false,
		sortBy: localStorage.sortBy || 'title'
	};

	/**
	*
	* Load articles from file and store them
	*
	*/
	function loadArticles (filename) {
		if (!filename) {
			filename = (!tableState.additionalFile) ? articles : moreArticles;
		}

		$tableBody.addClass('loading');
		if (!tableState.isDoneLoading) {
			$.getJSON(filename, function (json) {
				// Add articles to store
				articlesStore = articlesStore.concat(json);
				// Check if we've loaded all there is
				checkIfDone();
				// Update and render
				render();
			}).always(function () {
				$tableBody.removeClass('loading');
				$showMore.removeClass('loading');
			}).fail(function() {
				$tableBody
					.html('Something went wrong loading the articles.');
			});
		}
	}

	/**
	*
	* Check if we're showning all available articles
	*
	*/
	function checkIfDone () {
		tableState.isDoneLoading = (articlesStore.length >= articles.length + moreArticles.length);
	}

	/**
	*
	* Get full name out of article object
	*
	*/
	function getFullName (article) {
		var first = article.profile.first_name,
			last = article.profile.last_name;
		return first + ' ' + last;
	}

	/**
	*
	* Get time delta out of article object
	*
	*/
	function getTimeDelta (article) {
		return moment(article.publish_at, 'YYYY-MM-DD HH:mm:ss').fromNow();
	}

	/**
	*
	* Filter articles to show based on the state
	*
	*/
	function filterArticles () {
		articlesShown = articlesStore.slice(0, tableState.show);
	}

	/**
	*
	* Sort articles by given column, only those in display
	*
	*/
	function sortArticles () {
		articlesShown = _.sortBy(articlesShown, function (article) {
			return article[tableState.sortBy];
		}).reverse();
	}

	/**
	*
	* Append articles to the container
	*
	*/
	function appendArticles () {
		$tableBody.empty();

		$.each(articlesShown, function (i, article) {
			var oddOrEvenClass = (i % 2 === 0) ? 'even' : 'odd';
			var row = '<div class="article-row row-' + i + ' ' + oddOrEvenClass + '"></div>';
			$tableBody.append(row);

			$('.row-' + i).html(generateRowContent(article));

			$showMore.removeClass('loading');
		});
	}

	function generateRowContent (article) {
		var cellSpan = '<div class="cell">';
		var rowContent = cellSpan + '<img width="50" height="50" src="' + article.image + '"/>';
		rowContent += '<a href="' + article.url + '">' + article.title + '</a></div>';
		rowContent += cellSpan + '<p>' + getFullName(article) + '</p></div>';
		rowContent += cellSpan + '<p>' + article.words + '</p></div>';
		rowContent += cellSpan + '<p>' + getTimeDelta(article) + '</p></div>';
		return rowContent;
	}

	/**
	*
	* Sorting handler
	*
	*/
	function sortByEvent () {
		$('.words-header').click(function () {
			tableState.sortBy = 'words';
			localStorage.sortBy = 'words';
			$('.sorted').removeClass('sorted');
			$(this).addClass('sorted');
			render();
		});
		$('.submitted-header').click(function () {
			tableState.sortBy = 'publish_at';
			localStorage.sortBy = 'publish_at';
			$('.sorted').removeClass('sorted');
			$(this).addClass('sorted');
			render();
		});
	}

	/**
	*
	* Click handler for SHOW MORE
	*
	*/
	function showMoreEvent () {
		$showMore.click(function () {
			$(this).addClass('loading');
			tableState.show += 10;
			if (!tableState.isDoneLoading) {
				if (tableState.show > articlesStore.length) {
					tableState.additionalFile = true;
					loadArticles();
				} else {
					render();
				}
			} else {
				if (tableState.show > articlesStore.length) {
					$(this)
						.html('No more articles')
						.addClass('disabled');
				} else {
					render();
				}
			}
		});
	}

	/**
	*
	* Update from state and render
	*
	*/
	function render () {
		filterArticles();
		sortArticles();
		appendArticles();
	}

	/**
	*
	* Run the thing!
	*
	*/
	loadArticles();
	showMoreEvent();
	sortByEvent();
}());
