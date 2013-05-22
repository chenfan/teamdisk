<?php 

/*

This is the best starting point if you're just interested in setting up a fileserver.

Make sure that the 'public' and 'tmpdata' exists, with write permissions
for your server.

*/

// settings
error_reporting(E_ALL);
ini_set('display_errors','on');
date_default_timezone_set('Canada/Eastern');
$publicDir = 'public';
$tmpDir = 'tmpdata';

// If you want to run the SabreDAV server in a custom location (using mod_rewrite for instance)
// You can override the baseUri here.
 $baseUri = '/';

// Files we need
require_once 'vendor/autoload.php';

/* Database */
$pdo = new PDO('mysql:host=w.rdc.sae.sina.com.cn;port=3307;dbname=xxxxx','xxxxx','xxxxxxxx');

$pdo->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);

$authBackend      = new Sabre_DAV_Auth_Backend_PDO($pdo);

class MyCollection extends Sabre_DAV_Collection {

	private $myPath;

	protected $pdo;

	function __construct($myPath,$pdo,$user) {

		$this->myPath = $myPath;

		$result = $pdo->query("SELECT folder.name FROM folder,users,folder_user where folder_user.uid = users.id and folder_user.id=folder.id and users.username='".$user."'");

		$this->principals = array();

		while($row = $result->fetch(PDO::FETCH_ASSOC)) {

			$this->principals[] = $row['name'];

		}

	}

	function getChildren() {

		$children = array();
		// Loop through the directory, and create objects for each node
		foreach($this->principals as $node) {		
		  // Ignoring files staring with .
		  if ($node[0]==='.') continue;

		  $children[] = $this->getChild($node);

		}

		return $children;

	}

    function getName() {
        return basename($this->myPath);

    }
	
	public function createFile($name, $data = null) {

        $newPath = $this->myPath . '/' . $name;
		
        file_put_contents($newPath,$data);

    }

    /**
     * Creates a new subdirectory
     *
     * @param string $name
     * @return void
     */
    public function createDirectory($name) {
	
        $newPath = $this->myPath . '/' . $name;
        $a = mkdir($newPath);

    }

    /**
     * Returns a specific child node, referenced by its name
     *
     * This method must throw Sabre_DAV_Exception_NotFound if the node does not
     * exist.
     *
     * @param string $name
     * @throws Sabre_DAV_Exception_NotFound
     * @return Sabre_DAV_INode
     */
    public function getChild($name) {

        $path = $this->myPath . '/' . $name;
		//var_dump($name,$this->principals);
		//echo "<br>";
		if(!in_array($name,$this->principals)) {
			throw new Sabre_DAV_Exception_Forbidden('File with name ' . $path . ' donot have pemit');
		}
        if (!file_exists($path)) throw new Sabre_DAV_Exception_NotFound('File with name ' . $path . ' could not be located');

        if (is_dir($path)) {

            return new Sabre_DAV_FS_Directory($path);

        } else {

            return new Sabre_DAV_FS_File($path);

        }

    }

    /**
     * Checks if a child exists.
     *
     * @param string $name
     * @return bool
     */
    public function childExists($name) {

        $path = $this->myPath . '/' . $name;
        return file_exists($path);

    }

    /**
     * Deletes all files in this directory, and then itself
     *
     * @return void
     */
    public function delete() {

        foreach($this->getChildren() as $child) $child->delete();
        rmdir($this->myPath);

    }

    /**
     * Returns available diskspace information
     *
     * @return array
     */
    public function getQuotaInfo() {
        return array(
            disk_total_space($this->path)-disk_free_space($this->path),
            disk_free_space($this->path)
            );

    }

}

class MyFile extends Sabre_DAV_File {

  private $myPath;

  function __construct($myPath) {

    $this->myPath = $myPath;

  }

  function getName() {

      return basename($this->myPath);

  }

  function get() {

    return fopen($this->myPath,'r');

  }

  function getSize() {

      return filesize($this->myPath);

  }

  public function put($data) {

        file_put_contents($this->path,$data);

  }
}

// The rootNode needs to be passed to the server object.
$server = new Sabre_DAV_Server();

$server->setBaseUri($baseUri);

// Support for LOCK and UNLOCK
$lockBackend = new Sabre_DAV_Locks_Backend_File($tmpDir . '/locksdb');
$lockPlugin = new Sabre_DAV_Locks_Plugin($lockBackend);
$server->addPlugin($lockPlugin);

// Automatically guess (some) contenttypes, based on extesion
$server->addPlugin(new Sabre_DAV_Browser_GuessContentType());
$server->addPlugin(new Sabre_DAV_Browser_Plugin());

// Authentication backend
//$authBackend = new Sabre_DAV_Auth_Backend_File('.htdigest');
$authBackend      = new Sabre_DAV_Auth_Backend_PDO($pdo);
$auth = new Sabre_DAV_Auth_Plugin($authBackend,'SabreDAV');
$server->addPlugin($auth);


$digest = new Sabre_HTTP_DigestAuth();

// Hooking up request and response objects
$digest->setHTTPRequest($server->httpRequest);
$digest->setHTTPResponse($server->httpResponse);

$digest->setRealm('SabreDAV');
$digest->init();

$user = $digest->getUsername();

$rootNode = new MyCollection($publicDir,$pdo,$user);
$server->tree = new Sabre_DAV_ObjectTree($rootNode);

// Temporary file filter
$tempFF = new Sabre_DAV_TemporaryFileFilterPlugin($tmpDir);
$server->addPlugin($tempFF);

// And off we go!
$server->exec();