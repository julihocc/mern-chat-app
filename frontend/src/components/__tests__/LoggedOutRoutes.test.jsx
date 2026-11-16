import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { I18nextProvider } from "react-i18next";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import userReducer from "../../redux/slices/userSlice";
import i18n from "../../utils/i18n";
import MainRoutes from "../../MainRoutes.jsx";

vi.mock("../Dashboard.jsx", () => ({
	default: () => <div>dashboard-page</div>,
}));
vi.mock("../ChatRoomViewer.jsx", () => ({
	default: () => <div>chat-page</div>,
}));
vi.mock("../Settings.jsx", () => ({
	default: () => <div>settings-page</div>,
}));
vi.mock("../SignUp.jsx", () => ({
	default: () => <div>signup-page</div>,
}));
vi.mock("../Logout.jsx", () => ({
	default: () => <div>logout-page</div>,
}));
vi.mock("../LanguageSwitcher.jsx", () => ({
	default: () => null,
}));

const apolloClient = new ApolloClient({
	cache: new InMemoryCache(),
	link: new HttpLink({ uri: "http://127.0.0.1:9/graphql" }),
});

function renderLoggedOut(path) {
	const store = configureStore({
		reducer: { user: userReducer },
	});
	render(
		<ApolloProvider client={apolloClient}>
			<I18nextProvider i18n={i18n}>
				<Provider store={store}>
					<MemoryRouter initialEntries={[path]}>
						<MainRoutes />
					</MemoryRouter>
				</Provider>
			</I18nextProvider>
		</ApolloProvider>,
	);
}

describe("logged-out routes", () => {
	it.each(["/", "/dashboard", "/chat/room-1", "/settings"])(
		"sends %s to the login screen",
		async (path) => {
			renderLoggedOut(path);
			expect(
				await screen.findByRole("heading", { name: /login/i }),
			).toBeInTheDocument();
			expect(screen.queryByText("dashboard-page")).not.toBeInTheDocument();
			expect(screen.queryByText("chat-page")).not.toBeInTheDocument();
			expect(screen.queryByText("settings-page")).not.toBeInTheDocument();
		},
	);
});
