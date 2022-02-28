package artbanx.client;

import com.cloudant.client.api.CloudantClient;
import com.cloudant.client.api.Database;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

import java.net.MalformedURLException;

public class AppTest {

	@Test
	public void testConnection() throws MalformedURLException {
		CloudantClient client = new App().getClient();
		assertEquals(4, client.getAllDbs().size(), "artist and artwork data is not reachable");
	}

	@Test
	public void testSearch() throws MalformedURLException {
		CloudantClient client = new App().getClient();
		Database artists = client.database("artists", false);
		Artist found = artists.find(Artist.class, "4609");
		assertNotNull(found, "Pablo Picasso not found");
	}
}
