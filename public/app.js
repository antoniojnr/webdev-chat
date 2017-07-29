angular.module('chat', [])
  .controller('MainController', MainController)

function MainController($scope, $http, $location, $anchorScroll) {
  var self = this
  self.lines = []

  self.connect = function() {
		var source = new EventSource('http://localhost:3000/stream')
  	source.addEventListener('message',
	  	function(event) {
	  		$scope.$apply(function () {
          self.lines.push(JSON.parse(event.data))
        })
			}, false
    )
  }

  self.send = function() {
    $http.post('http://localhost:3000/chat', {
      line: self.line,
      user: self.nickname
    });
    self.gotoBottom();
    self.line = "";
  }

  self.gotoBottom = function() {
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash('bottom');

      // call $anchorScroll()
      $anchorScroll();
    };
}
