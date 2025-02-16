import { TypeDaprBindingCallback } from "../../types/DaprBindingCallback.type";

export default interface IServerBinding {
    receive(bindingName: string, cb: TypeDaprBindingCallback): Promise<any>;
}