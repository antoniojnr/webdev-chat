angular.module('chat', [])
  .controller('MainController', MainController)

function MainController($scope, $http, $location, $anchorScroll) {
  var self = this
  self.lines = []

  self.connect = function() {
		var source = new EventSource(API + '/stream')
  	source.addEventListener('message',
	  	function(event) {
	  		$scope.$apply(function () {
          self.lines.push(JSON.parse(event.data))
        })
			}, false
    )
  }

  self.send = function() {
    $http.post(API + '/chat', {
      line: self.line,
      user: self.nickname
    }).then(function(res) {
      self.gotoBottom()
      self.line = ""
    }, function(err) {
      console.log(err)
    });
  }

  self.gotoBottom = function() {
    $location.hash('bottom');
    $anchorScroll();
  };
}
