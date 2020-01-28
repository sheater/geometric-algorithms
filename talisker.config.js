module.exports = {
  port: process.env.PORT || 3000,
  locations: [          // locations, it is explained below
		[/^\//, ({ url }) => ({ root: '/dist', tryFiles: [url, 'index.html'] })],
	]
};
