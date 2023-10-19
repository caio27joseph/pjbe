import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Library } from './entities/library.entity';

export abstract class SubscriptionEvent {
  // Define the event name as a static property in derived classes
  static EVENT: string;

  // Static method to create a payload. This method doesn't rely on instance properties.
  // Instead, it takes the data as an argument.
  public static toPayload<T>(data: T): Record<string, T> {
    if (!this.EVENT) {
      throw new Error('EVENT is not defined in the SubscriptionEvent class.');
    }
    return { [this.EVENT]: data };
  }
}

@ObjectType()
export class LibraryEvent extends SubscriptionEvent {
  static EVENT: string = 'libraryEvent'; // Define the actual event name
  @Field({ nullable: true })
  updated?: Library; // or other relevant fields for updated libraries

  @Field({ nullable: true })
  removed?: Library; // or other relevant fields for removed libraries

  @Field({ nullable: true })
  created?: Library; // or other relevant fields for created libraries
}
