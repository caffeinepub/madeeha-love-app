import Int "mo:core/Int";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Map "mo:core/Map";

actor {
  type Reply = {
    message : Text;
    timestamp : Time.Time;
  };

  module Reply {
    public func compare(reply1 : Reply, reply2 : Reply) : Order.Order {
      Int.compare(reply1.timestamp, reply2.timestamp);
    };
  };

  let replies = Map.empty<Time.Time, Reply>();

  public type ReplyPayload = {
    message : Text;
  };

  public shared ({ caller }) func submitReply(payload : ReplyPayload) : async () {
    let timestamp = Time.now();
    let reply : Reply = {
      payload with
      timestamp;
    };
    replies.add(timestamp, reply);
  };

  public query ({ caller }) func getReply(timestamp : Time.Time) : async Reply {
    switch (replies.get(timestamp)) {
      case (null) { Runtime.trap("Reply does not exist") };
      case (?reply) { reply };
    };
  };

  public query ({ caller }) func getAllReplies() : async [Reply] {
    replies.values().toArray().sort();
  };
};
