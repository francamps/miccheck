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
		$.getJSON(filename, function (json) {
			articlesStore = json;
			filterArticles();
			appendArticles();
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

	/**
	*
	* Append articles to the container
	*
	*/
	function appendArticles () {
		$("#container").html("");
		$.each(articlesShown, function (i, article) {
			var span = '<span>';
			span += article.title + " // ";
			span += article.author + " // ";
			span += article.words + " // ";
			span += '</span>';
			$("#container").append(span);
		});
	}

	/**
	*
	* Click handler for SHOW MORE
	*
	*/
	function showMore () {
		$('.show-more').click(function () {
			tableState.show += 10;
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
