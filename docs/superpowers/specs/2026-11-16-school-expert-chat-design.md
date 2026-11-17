# School expert chat

Written design for the chat in this repo. Agreed picture, plus the waiting-list choice, on 2026-11-16. Ready for approval. Nothing is built until this design is approved.

## Intent

Retarget this people-to-people chat into a school conversation. A student asks a course or an office. An expert answers. The AI helps the student say the question more clearly, and helps the expert draft a reply from the school's documents and from answers experts have chosen to keep. The student never receives an answer from the model.

## Goals

- A student can pick a course or an office, write a question, and get help rephrasing that question.
- An expert of that group can take the conversation and send the reply the student sees.
- While the expert writes, the AI can propose a reply using only that group's documents, documents marked for the whole school, and marked answers from that group.
- An expert can add the school's documents, mark one as school-wide, and mark their own sent answer as worth reusing.
- An expert who already belongs to a group can add another expert.
- The customer-service idea stays: the expert is responsible for what the student is told.

## Non-goals

- Fine-tuning a model.
- Streaming the reply.
- Optical character recognition, photos, or scanned pages with no text layer.
- More than one expert in the same conversation.
- Hand-off from one expert to another.
- The student browsing documents or marked answers.
- Deleting the old contact-request API in this slice. The new screens do not use it.
- A fourth deployable service.

## Anti-goals

- The model sends a message into the room by itself.
- The model answers the student, including by hiding an answer inside a "clearer question."
- A suggestion, a document, or a marked-answer record is stored as a normal chat message. Every normal message is visible to every participant.
- The model invents school rules when nothing relevant was retrieved.
- The API key reaches the browser, a Vite variable, or any service other than the gateway.
- A student, or an expert from another group, reads a waiting conversation or a document body.

## What he decided

- The friend chat is retargeted for school use.
- An expert may be a professor, an administrator, or a similar person.
- An expert who already belongs to a course or an office adds other experts.
- The student chooses a course or an office. Any expert in that group may take the conversation.
- The AI helps the student write a clearer question and does not give the student an answer.
- The knowledge base is documents experts add, plus answers experts mark.
- For one conversation, search that group's documents and marked answers, plus documents marked for the whole school.
- The expert marks their own sent answer when it should be reused.
- Before anyone takes a waiting conversation, every expert of that group sees the opening question and the student's username. They do not see the student's email. After one expert takes it, the others no longer see the messages.

## Calls made in this design

- A course and an office are the same kind of group, with a kind of `course` or `office`.
- Any expert may create a group and becomes its first member. A student cannot. The first expert in a school is the user named by `BOOTSTRAP_EXPERT_EMAIL` on the gateway. That address is empty until someone sets it. It is never committed.
- Once an expert takes a conversation, only that expert and the student are participants. Other experts no longer see the messages.
- Wording help is available on every student draft, including follow-ups. It receives the draft and the group name only. It does not receive documents, marked answers, or earlier replies.
- The expert's proposal is a gateway response, not a saved message. The reusable text is the message the expert actually sent.
- Marking pairs that sent message with the nearest earlier message from the student.
- If search finds nothing relevant, the expert sees that there is nothing to suggest, and the gateway does not call the model.
- The model may use only the retrieved excerpts. The prompt forbids using outside knowledge of the school.
- School-wide documents may be added by any expert. A group document may be added only by an expert of that group.
- Documents are stored as extracted text. Accepted files are `.txt`, `.md`, and `.pdf` that already contain text. Limit 5 MB. Empty extraction is rejected.
- Search is a text index over chunks and marked answers, not a vector database. The xAI docs consulted on 2026-11-16 list no embeddings API. If one exists when this is built, the builder may use it without changing who can see what.
- The gateway calls xAI with the OpenAI Node client, base URL `https://api.x.ai/v1`, Responses API, model `grok-4.7`, key `XAI_API_KEY`. Re-read https://docs.x.ai before coding and follow the current quickstart if those names have moved.
- New interface strings go in `frontend/public/resources.csv` for `en`, `fr`, and `es`.
- The suggestion is in the language of the student's messages. The rephrased question is in the language of the draft.
- Real-time arrival of a new waiting conversation uses the gateway's existing in-process pub/sub. It works for one gateway process, as today's subscriptions do.

## Conversation

1. A signed-in student sees the names and kinds of groups. They do not see members' private data or any document text.
2. They write a draft. They may ask for a clearer wording. The clearer wording replaces the draft only if they accept it.
3. They send. The chat service creates a room with `groupId`, status `waiting`, and the student as the only participant. The opening text is a normal message.
4. Experts of that group see it in a waiting list: the opening question and the student's username. The first expert to take it is added as a participant and the status becomes `active`. A second take fails. From then on, only the student and that expert can read the messages. The waiting list stops showing the question.
5. The expert may ask for a proposed reply. The gateway checks that they are the expert participant, loads the room's messages, searches the allowed material, and returns a proposal plus the excerpts it used. The proposal is not saved.
6. The expert edits and sends through the existing `sendMessage` path. The student sees that message on the existing `newMessage` subscription.
7. The expert may mark that sent message. The mark stores the group, the nearest earlier student message, the sent text, the message id, and who marked it. Later searches in that group can return it. It is not copied into other groups.

## Who can do what

- List group names: any signed-in user.
- Create a group: an expert of any group, or the bootstrap expert.
- Add an expert: an expert of that group. The new person must already have an account. They are found by email.
- Upload a group document: an expert of that group.
- Upload a school-wide document: any expert.
- Start a conversation: any signed-in user, for a group that exists.
- See a waiting conversation: an expert of that group sees the opening question and the student's username, and only until an expert takes it.
- Take a conversation: an expert of that group, and only while it is waiting.
- Read messages after it is taken: the student and the expert who took it. This is the participant rule the gateway already uses.
- Rephrase a draft: the signed-in author of that draft. No knowledge-base text in the prompt.
- Propose a reply: the expert participant of that room.
- Mark an answer: the expert who sent that message.
- Read document text or marked-answer records: only through the expert proposal, and only the excerpts for a room that expert is in. There is no student query for them.

## Stored records

Group, in the contact service: name, kind (`course` or `office`), who created it.

Membership, in the contact service: user id, group id. Members are experts. Students are not members.

Room, extended in the chat service: existing participants and messages, plus `groupId`, status `waiting` or `active`, and the expert id once taken.

Message: unchanged. `senderId`, `body`, optional file, `chatRoomId`.

Document, in the chat service: file name, scope `group` or `school`, group id when the scope is `group`, who uploaded it.

Chunk, in the chat service: document id, the same scope and group id, and the text. Indexed for text search.

Marked answer, in the chat service: group id, question text, answer text, message id, who marked it.

The gateway stores nothing of this. It holds no database of its own today, and this design does not add one.

## Model calls

Both calls happen only on the gateway, after the checks above.

Rephrase: system instruction to rewrite the student's draft so it is clearer, without adding facts, answers, or school policy. Input is the draft and the group name. Output is the rewritten draft only.

Propose reply: system instruction to draft a reply the expert might send, using only the supplied excerpts, and to say when the excerpts do not cover the question. Input is the room messages plus the excerpts. Output is the proposed reply and nothing else. The server drops the call when there are no excerpts.

`XAI_API_KEY` is added to the gateway in `docker-compose.yaml` and to local gateway instructions. It is not given to auth, contact, chat, or the frontend image.

## What changes in this repo

- Contact service: groups and memberships, beside the current contact-request code.
- Chat service: room fields, documents, chunks, marked answers, and the searches the gateway needs.
- Gateway: the new queries and mutations, the two model calls, and subscription filtering so a waiting conversation is offered only to experts of that group.
- Frontend: the dashboard becomes the school home (groups, start a question, waiting list for experts, add an expert, upload). `ChatRoomViewer` gains the rephrase control for the student, and the proposal panel plus the keep-this-answer control for the expert. Old contact-request, friend-group, and contact-list blocks are not shown.
- `frontend/public/resources.csv`: new keys in English, French, and Spanish.
- Tests: the gateway's auth checks for these new operations. A student request must not receive document text. A rephrase prompt must not contain knowledge-base text. A non-member must not take a conversation. A user who did not send a message must not mark it. The frontend already uses Vitest; cover the student path and the expert path at the component level for the new controls.

## Left to the builder

- Exact field names, route paths, and how the files are split.
- The PDF text library, the chunk size, and the text-index query.
- The wording of the two prompts, as long as the rules in "Model calls" hold.
- The visual layout, as long as the proposal is visibly separate from the messages the student sees.
- Whether a waiting conversation uses a new subscription or refetches the waiting list. Either one must still hide the body from anyone who is not an expert of that group.

## Done when

- A student can open a course, accept a clearer question, and send it.
- A second student cannot read that room.
- An expert of the course sees the opening question and the student's username while it is waiting, then loses that view once another expert takes it.
- An expert of the course can take it, see a proposal drawn from a course document and from a school-wide document, edit it, and send it.
- An expert of another course cannot take it and cannot see those excerpts.
- After the expert marks the sent answer, a later question in the same course can surface it, and a question in another course cannot.
- With no documents and no marked answers, the expert gets "nothing to suggest" and no model call.
- The rephrase result does not add a school fact that was not in the student's draft.
- The key is present only in the gateway environment.
