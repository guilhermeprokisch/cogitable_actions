var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const cogitable = (app) => {
    app.on('issues.opened', (context) => __awaiter(void 0, void 0, void 0, function* () {
        const issueComment = context.issue({
            body: 'Thanks for opening this issue!'
        });
        yield context.octokit.issues.createComment(issueComment);
    }));
};
