// Error.js
import React from "react";

const Error = ({queryName, message}) => (<p>
		{queryName} Error: {message}
	</p>);

export default Error;
