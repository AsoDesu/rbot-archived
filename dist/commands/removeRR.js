"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const firebase_1 = __importDefault(require("firebase"));
var database = firebase_1.default.firestore();
var auth = firebase_1.default.auth();
auth.signInWithEmailAndPassword('susBot@gmail.com', process.env.FIREPASS);
function command(msg, args) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!msg.member.hasPermission('MANAGE_ROLES')) {
            msg.channel.send('You don\'t have permssion to do that');
            return;
        }
        if (!args[0]) {
            msg.channel.send('Correct usage `!removerr {message id}`');
        }
        database.collection(msg.guild.id).where('msgId', '==', args[0]).get().then(docs => {
            if (docs.size == 0) {
                msg.reply('That reaction role does not exist');
                return;
            }
            docs.forEach((doc) => __awaiter(this, void 0, void 0, function* () {
                var message = yield msg.channel.send('Deleting reaction role');
                database.collection(msg.guild.id).doc(doc.id).delete();
                yield message.edit('Deleted');
            }));
        });
    });
}
exports.default = command;
