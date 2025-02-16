import HTTPClient from './HTTPClient';
import { OperationType } from '../../../types/Operation.type';
import { ActorReminderType } from '../../../types/ActorReminder.type';
import { ActorTimerType } from '../../../types/ActorTimer.type';
import IClientActor from '../../../interfaces/Client/IClientActor';
import { KeyValueType } from '../../../types/KeyValue.type';

// https://docs.dapr.io/reference/api/actors_api/
export default class HTTPClientActor implements IClientActor {
  client: HTTPClient;

  constructor(client: HTTPClient) {
    this.client = client;
  }

  async invoke(method: "GET" | "POST" | "PUT" | "DELETE" = "POST", actorType: string, actorId: string, methodName: string, body?: any): Promise<object> {
    const result = await this.client.execute(`/actors/${actorType}/${actorId}/method/${methodName}`, {
      method,
      body
    });

    return result as object;
  }

  async stateTransaction(actorType: string, actorId: string, operations: OperationType[]): Promise<void> {
    await this.client.execute(`/actors/${actorType}/${actorId}/state`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(operations)
    });
  }

  async stateGet(actorType: string, actorId: string, key: string): Promise<KeyValueType | string> {
    const result = await this.client.execute(`/actors/${actorType}/${actorId}/state/${key}`);
    return result as any;
  }

  async reminderCreate(actorType: string, actorId: string, name: string, reminder: ActorReminderType): Promise<void> {
    await this.client.execute(`/actors/${actorType}/${actorId}/reminders/${name}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        period: reminder.period.toString().toLocaleLowerCase().replace('pt', ''),
        dueTime: reminder?.dueTime?.toString()?.toLocaleLowerCase().replace('pt', ''),
        data: reminder.data
      }),
    });
  }

  async reminderGet(actorType: string, actorId: string, name: string): Promise<object> {
    const result = await this.client.execute(`/actors/${actorType}/${actorId}/reminders/${name}`);
    return result as object;
  }

  async reminderDelete(actorType: string, actorId: string, name: string): Promise<void> {
    await this.client.execute(`/actors/${actorType}/${actorId}/reminders/${name}`, {
      method: 'DELETE',
    });
  }

  async timerCreate(actorType: string, actorId: string, name: string, timer: ActorTimerType): Promise<void> {
    await this.client.execute(`/actors/${actorType}/${actorId}/timers/${name}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        period: timer.period.toString().toLocaleLowerCase().replace('pt', ''),
        dueTime: timer?.dueTime?.toString()?.toLocaleLowerCase().replace('pt', ''),
        data: timer.data,
        callback: timer.callback
      }),
    });
  }

  async timerDelete(actorType: string, actorId: string, name: string): Promise<void> {
    await this.client.execute(`/actors/${actorType}/${actorId}/timers/${name}`, {
      method: 'DELETE',
    });
  }

  async deactivate(actorType: string, actorId: string): Promise<void> {
    await this.client.execute(`/actors/${actorType}/${actorId}`, {
      method: 'DELETE',
    });
  }

  async getActors(): Promise<object> {
    const result = await this.client.execute(`replace('/v1.0', '')}/dapr/config`);
    return result as object;
  }
}
