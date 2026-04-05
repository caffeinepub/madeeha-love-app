import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Reply {
    message: string;
    timestamp: Time;
}
export type Time = bigint;
export interface ReplyPayload {
    message: string;
}
export interface backendInterface {
    getAllReplies(): Promise<Array<Reply>>;
    getReply(timestamp: Time): Promise<Reply>;
    submitReply(payload: ReplyPayload): Promise<void>;
}
