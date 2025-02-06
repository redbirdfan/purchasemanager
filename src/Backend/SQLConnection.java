import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import io.github.cdimascio.dotenv.Dotenv

public class SQLConnection {
    
    private String url;
    private String username;    
    private String password;
    private Connection connection;

    public SQLConnection(String url, String username, String password) {
        this.url = url;
        this.username = username;
        this.password = password;
        this.connection = null;
    }

    public Connection getConnection() throws SQLException{
        if (connection == null || connection.isClosed()) {
            try{
                connection = DriverManager.getConnection(url, username, password);
                System.out.println("DataBase connection made");
            
            } catch (SQLException e) {
                System.err.println("Failed to connect to database");
                throw e;
            }
        } return connection;
    }

    public void closeConnection() throws SQLException {
        if (connection != null && !connection.isClosed()) {
            connection.close();
            System.out.println("SQL Connection closed");
        }
    } 

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();
        System.out.println(dotenv.get("URL"));
        String url = dotenv.get("URL");
        String username = dotenv.get("USERNAME");
        String password = dotenv.get("PASSWORD");

        SQLConnection connection = new SQLConnection(url, username, password);

        try {
            Connection conn = connection.getConnection();
            connection.closeConnection();
            
        } catch (SQLException e) {
            System.err.println("Error:" + e.getMessage());
        }
    }
}

