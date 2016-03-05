(function(){
    var socket = io('http://hidden-coast-7501.herokuapp.com/');
    var alreadyGotLastMessages = false;

    function sendMsg(e){
        e.preventDefault();
        var mandatory = ['#msg', '#uname'];
        mandatory.forEach(function(f){
            if($(f).val() == '')
                $(f).parent().addClass('has-error');
            else
                $(f).parent().removeClass('has-error');
        });

        if( $('#msg').val().length > 250 ){
            $('.alert').show();
            $('#msg').parent().addClass('has-error');
            return;
        }

        if($('#msg').val() !== '' && $('#uname').val() !== ''){
            socket.emit('msg', $('#msg').val());
            $('#msg').val('');
        }


    }

    function closeAlert(e){
        e.preventDefault();
        $('.alert').hide();
    }

    socket.on('msg', function(data){
        var msg = '['+(new Date()).toTimeString().split(' ')[0] + '] ' + data.sender + ': ' + data.msg;
        $('#msgList').append($('<li>').text(msg));
    });

    socket.on('connect', function(data){
        console.log(socket.id);
        $('#uname').val(socket.id);
        socket.emit('getLast', $('#msg').val());
    });

    socket.on('lastMsgs', function(data){
        console.log(data);

        // remember we already have messages in case server disconnected/rebooted
        if(!alreadyGotLastMessages){
            data.forEach(function(msg){
                var msg = '['+(new Date(msg.date)).toTimeString().split(' ')[0] + '] ' + msg.uname + ': ' + msg.msg;
                $('#msgList').append($('<li>').text(msg));
            });
            alreadyGotLastMessages = true;
        }
    });

    $(function(){
        $('.alert').hide();
        window.sendMsg = sendMsg;
        window.closeAlert = closeAlert;
    });
})();

