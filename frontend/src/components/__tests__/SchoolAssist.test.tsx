import {describe, expect, it, vi} from "vitest";
import {fireEvent, screen} from "@testing-library/react";
import {renderWithProviders} from "@test/utils/testing-library.tsx";
import SchoolAssist from "../SchoolAssist.tsx";
import {MARK_ANSWER, SUGGEST_QUESTION_WORDING, SUGGEST_REPLY} from "../../gql/school";

const messages = [
	{_id: "m1", body: "When is the exam?", senderId: {_id: "student-1"}},
	{_id: "m2", body: "Friday at 9.", senderId: {_id: "expert-1"}},
];

const renderAssist = (props: any, mocks: any[] = []) =>
	renderWithProviders(
		<SchoolAssist
			chatRoomId="room-1"
			groupId="group-1"
			expertId="expert-1"
			currentUserId="student-1"
			draft="exam?"
			setDraft={() => {}}
			messages={messages}
			{...props}
		/>,
		{mocks},
	);

describe("SchoolAssist", () => {
	it("renders nothing when the room is not a school conversation", async () => {
		await renderAssist({groupId: null, draft: ""});
		expect(screen.queryByRole("button")).not.toBeInTheDocument();
	});

	it("lets a student accept a clearer question without showing the expert tools", async () => {
		const setDraft = vi.fn();
		await renderAssist({setDraft}, [
			{
				request: {
					query: SUGGEST_QUESTION_WORDING,
					variables: {groupId: "group-1", draft: "exam?"},
				},
				result: {data: {suggestQuestionWording: "When is the exam?"}},
			},
		]);

		expect(await screen.findByRole("button", {name: /make this clearer/i})).toBeInTheDocument();
		expect(screen.queryByRole("button", {name: /suggest a reply/i})).not.toBeInTheDocument();
		expect(screen.queryByRole("button", {name: /keep this answer/i})).not.toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", {name: /make this clearer/i}));
		expect(await screen.findByText("When is the exam?")).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", {name: /use this/i}));
		expect(setDraft).toHaveBeenCalledWith("When is the exam?");
	});

	it("lets the expert copy a private proposal and keep their own answer", async () => {
		const setDraft = vi.fn();
		await renderAssist({currentUserId: "expert-1", draft: "", setDraft}, [
			{
				request: {query: SUGGEST_REPLY, variables: {chatRoomId: "room-1"}},
				result: {
					data: {
						suggestReply: {
							proposal: "The exam is on Friday at 9.",
							nothingToSuggest: false,
							excerpts: ["Course calendar: Friday at 9."],
						},
					},
				},
			},
			{
				request: {query: MARK_ANSWER, variables: {messageId: "m2"}},
				result: {data: {markAnswer: true}},
			},
		]);

		expect(screen.queryByRole("button", {name: /make this clearer/i})).not.toBeInTheDocument();
		expect(await screen.findByRole("button", {name: /suggest a reply/i})).toBeInTheDocument();
		expect(screen.getByRole("button", {name: /keep this answer/i}).textContent).toContain("Friday at 9.");

		fireEvent.click(screen.getByRole("button", {name: /suggest a reply/i}));
		expect(await screen.findByText("The exam is on Friday at 9.")).toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", {name: /use this/i}));
		expect(setDraft).toHaveBeenCalledWith("The exam is on Friday at 9.");

		fireEvent.click(screen.getByRole("button", {name: /keep this answer/i}));
		expect(await screen.findByText("Keep this answer", {exact: true})).toBeInTheDocument();
	});

	it("tells the expert when the school has nothing to suggest", async () => {
		await renderAssist({currentUserId: "expert-1", draft: ""}, [
			{
				request: {query: SUGGEST_REPLY, variables: {chatRoomId: "room-1"}},
				result: {
					data: {
						suggestReply: {proposal: null, nothingToSuggest: true, excerpts: []},
					},
				},
			},
		]);

		fireEvent.click(await screen.findByRole("button", {name: /suggest a reply/i}));
		expect(await screen.findByText(/nothing to suggest/i)).toBeInTheDocument();
		expect(screen.queryByRole("button", {name: /use this/i})).not.toBeInTheDocument();
	});
});
