<script setup>
    import { io } from 'socket.io-client'
    import { onBeforeMount, ref } from 'vue';

    const socket = io('http://localhost:3001');

    //ref defines local state, maintains as we get messages from the server
    const messages = ref([]);
    const messageText = ref('');
    const joined = ref(false);
    const name = ref('');
    const typingDisplay = ref('');

    //onBeforeMount defines logic takes place
    onBeforeMount(function() {
        socket.emit('findAllMessages', {}, function(response) {
            messages.value = response;
        });

         //Updates the messages in the browser when a new message is added
        socket.on('message', function(message) {
        messages.value.push(message);
        });

        //Creates a listener for onTyping
        socket.on('typing', function( {name, isTyping }){
            if (isTyping) {
                typingDisplay.value = `${name} is typing...`;
            } else {
                typingDisplay.value = '';
            }
        });
    });


    //Allows the clients to send messages
    const sendMessage = function(){
        socket.emit('createMessage', { text: messageText.value}, function() {
            //Clears the input after the message has been created
            messageText.value = '';
        })
    }

    //Defines a function for join the group chat
    const join = function(){
        socket.emit('join', { name: name.value}, function() {
            joined.value = true;
        })
    }

    //Defines a function to check if a client is typing
    let timeout;
    const emitTyping = function() {
        socket.emit('typing', { isTyping: true });
        
        timeout = setTimeout(function() {
            socket.emit('typing', { isTyping: false});
        }, 2000)
    }
</script>

<template>
    <div class="chat">
        <div v-if="!joined">
            <form @submit.prevent="join">
                <label>What's your name </label>
                <input v-model="name" />
                <button type="submit">Send</button>
            </form>
        </div>
        <div class="chat-containjer" v-else>
            <div class="messages-container">
                <div v-for="message in messages">
                    [{{ message.name }}]: {{ message.text }}
                </div>
            </div>
            <div v-if="typingDisplay"> {{ typingDisplay }}</div>
            <hr />
            <div class="message-input">
                <form @submit.prevent="sendMessage">
                    <label>Message: </label>
                    <input v-model="messageText" @input="emitTyping">
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.chat {
    padding: 20px;
    height: 10vh;
}

.chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.messages-container {
    flex: 1;
}
</style>
