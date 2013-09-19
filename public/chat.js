if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

$(document).ready(function() {

  // var messages = [];
  var localUser;
  // var server = io.connect('http://lit-dawn-6982.herokuapp.com/');
  var server = io.connect('http://loud.jit.su/')
  var $chats = $(".chat");
  var $inputs = $(".input");
  var username;

  // setting timer for server fake msg pushes -- custom event listener more reliable than running a server-side setInterval based on connection event. 
  setInterval(function () {
    server.emit('tick')
  }, 15000)


  // server.on('chats', function (data) {
  //   $chats.html(" ")
  //   for (var i=0; i < data.length; i++) {
  //     var $chatItem = $('<div class="chatItem"></div>')
  //     console.log(data[i])
  //     var usernameHTML = data[i].username
  //     var message = data[i].message
  //     $chatItem.append(usernameHTML + " " + message)
  //     $chats.append($chatItem)
  //   }
  // });

  server.on('message', function(data) {
    var $chatItem = $('<div class="item"></div>')
    if (data.uEvent) {
      $chatItem.append(data.username + " " + data.message)
      $chatItem.addClass("uonly");
    } else {
      $chatItem.append('<span class="user">' + data.username + ": </span> <br>" + data.message)
    }
    if (data.username === username) $chatItem.addClass('match')
    $chatItem.appendTo($chats)
    $chats.children().length > 9 && $chats.children().first().remove()
  })

  $('.namesend').on('click', function(e) {
    var name = $('#name').val().trim()
    if (name) {
      username = name
      e.preventDefault;
      server.emit('uRequest', name, function(reply) {
        if (reply !== 'username added') {
          $('#name').blur()
          $('#name').val('')
          $('#name').attr("placeholder", "Already in use! Try again.");
        } else {
          $('#name, .namesend').hide().remove();
          setTimeout(function() {
            $('#submit, .send').slideDown('fast')
          }, 300)
        }
        
      })
    }
  })

  $('.send').on('click', function(e) {
    var text = submit.value.trim().toUpperCase();
    if (text) {
      e.preventDefault;
      // server.emit('newUser', { message: name.value });
      // var text = $('.field').value().toUpperCase();
      server.emit('send', text);
      submit.value = "";
    }
  });

  $('h2').on('click', function() {
    $chats.fadeOut()
    $inputs.fadeOut(400, function () {
      $('.about').fadeIn(400, function() {
        $('.ribbon').fadeIn(2000)
      })
    })
    $('h1').addClass('pointer')
    $(this).removeClass('pointer')
  })

  $('h1').on('click', function() {
    $('.about').fadeOut(400, function() {
      $chats.fadeIn()
      $inputs.fadeIn()
      $('.ribbon').fadeOut(800)
      $('h1').removeClass('pointer')
      $('h2').addClass('pointer')
    })
  })

  $(':input').keypress(function(event) {
    if ( event.which == 13 ) {
      event.preventDefault();
      $(':input').trigger("click")
    }
  });
});