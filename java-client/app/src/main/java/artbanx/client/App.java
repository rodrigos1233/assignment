package artbanx.client;


import com.cloudant.client.api.ClientBuilder;
import com.cloudant.client.api.CloudantClient;
import com.cloudant.client.api.Database;
import com.cloudant.client.api.query.Expression;
import com.cloudant.client.api.query.QueryBuilder;
import com.cloudant.client.api.query.QueryResult;
import com.google.gson.GsonBuilder;

import java.net.MalformedURLException;
import java.net.URL;

class App {

	public static void main(String[] args) {
		try {
			App app = new App();
			CloudantClient client = app.getClient();
			app.search(client);
		} catch (MalformedURLException e) {
			System.out.println(e.getMessage());
			System.exit(-1);
		}
	}

	CloudantClient getClient() throws MalformedURLException {
		GsonBuilder builder = new GsonBuilder();
		builder.registerTypeAdapterFactory(new RecordTypeAdapterFactory());
		return ClientBuilder
				.url(new URL("http://localhost:5984"))
				.gsonBuilder(builder)
				.build();
	}

	void search(CloudantClient client) {

		Database artists = client.database("artists", false);
		Artist found = artists.find(Artist.class, "4609");
		System.out.println("lookup by ID: 4609");
		System.out.println(found.DisplayName());

		String query = new QueryBuilder(Expression.regex("DisplayName", ".*Pablo.*")).build();
		QueryResult<Artist> queryResult = artists.query(query, Artist.class);
		System.out.println("query result: DisplayName matching /.*Pablo.*/");
		queryResult.getDocs().forEach(artist -> System.out.println(artist.DisplayName()));

	}
}
