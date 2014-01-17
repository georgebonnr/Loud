if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

$(document).ready(function() {

  var localUser;
  var server = io.connect();
  var $chats = $(".chat");
  var $inputs = $(".input");
  var username;

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
