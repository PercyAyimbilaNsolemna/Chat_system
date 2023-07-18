import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

//The service will keep all the logic of the backend
//This interfaces with whatever the data story is how it stored
@Injectable()
export class MessagesService {
  //Creates a list to store all the messages
  messages: Message[] = [{ name: 'Marius', text: 'Heyoo' }];

  //Creates a dictionary to map client to the user
  clientToUser = {};

  //Identifies the client by mapping the clientId with the name
  identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;

    return Object.values(this.clientToUser);
  }

  //Defines a function that gets the clients name
  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }
  create(createMessageDto: CreateMessageDto, clientId: string) {
    const message = {
      name: this.clientToUser[clientId],
      text: createMessageDto.text,
    };
    this.messages.push(message);
    return message;
    //TODO: improve
  }

  findAll() {
    return this.messages;
  }
}
