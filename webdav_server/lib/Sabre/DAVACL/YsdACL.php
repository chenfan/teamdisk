<?php

/**
 *
 * @package Sabre
 * @subpackage DAVACL
 * @copyright Copyright (C) 2007-2012 Rooftop Solutions. All rights reserved.
 * @author Evert Pot (http://www.rooftopsolutions.nl/)
 * @license http://code.google.com/p/sabredav/wiki/License Modified BSD License
 */
class Sabre_DAVACL_YsdACL implements Sabre_DAVACL_IACL {

    /**
     * Returns the owner principal
     *
     * This must be a url to a principal, or null if there's no owner
     *
     * @return string|null
     */
	protected $principalProperties;

    /**
     * Principal backend
     *
     * @var Sabre_DAVACL_IPrincipalBackend
     */
    protected $principalBackend;

    /**
     * Creates the principal object
     *
     * @param Sabre_DAVACL_IPrincipalBackend $principalBackend
     * @param array $principalProperties
     */
    public function __construct(Sabre_DAVACL_IPrincipalBackend $principalBackend, array $principalProperties = array()) {

        if (!isset($principalProperties['uri'])) {
            throw new Sabre_DAV_Exception('The principal properties must at least contain the \'uri\' key');
        }
        $this->principalBackend = $principalBackend;
        $this->principalProperties = $principalProperties;

    }
	 
	
    public function getOwner() {
        return '123.txt';


    }

    /**
     * Returns a group principal
     *
     * This must be a url to a principal, or null if there's no owner
     *
     * @return string|null
     */
    public function getGroup() {

        return null;

    }

    /**
     * Returns a list of ACE's for this node.
     *
     * Each ACE has the following properties:
     *   * 'privilege', a string such as {DAV:}read or {DAV:}write. These are
     *     currently the only supported privileges
     *   * 'principal', a url to the principal who owns the node
     *   * 'protected' (optional), indicating that this ACE is not allowed to
     *      be updated.
     *
     * @return array
     */
    public function getACL(){
	echo 11111111;
	die();
		return array(
            array(
                'privilege' => '{DAV:}read',
                'principal' => $this->getPrincipalUrl(),
                'protected' => true,
            ),
        );
	
	}

    /**
     * Updates the ACL
     *
     * This method will receive a list of new ACE's as an array argument.
     *
     * @param array $acl
     * @return void
     */
    public function setACL(array $acl) {

        throw new Sabre_DAV_Exception_MethodNotAllowed('Updating ACLs is not allowed here');

    }

    /**
     * Returns the list of supported privileges for this node.
     *
     * The returned data structure is a list of nested privileges.
     * See Sabre_DAVACL_Plugin::getDefaultSupportedPrivilegeSet for a simple
     * standard structure.
     *
     * If null is returned from this method, the default privilege set is used,
     * which is fine for most common usecases.
     *
     * @return array|null
     */
    public function getSupportedPrivilegeSet() {

        return null;

    }

	public function getName() {

        list(, $name)  = Sabre_DAV_URLUtil::splitPath($this->path);
      //var_dump($this->path,$name);
        return $name;

    }

    /**
     * Renames the node
     *
     * @param string $name The new name
     * @return void
     */
    public function setName($name) {

        list($parentPath, ) = Sabre_DAV_URLUtil::splitPath($this->path);
        list(, $newName) = Sabre_DAV_URLUtil::splitPath($name);

        $newPath = $parentPath . '/' . $newName;
        rename($this->path,$newPath);

        $this->path = $newPath;

    }



    /**
     * Returns the last modification time, as a unix timestamp
     *
     * @return int
     */
    public function getLastModified() {

        return filemtime($this->path);

    }
	public function delete() {

        return null;

    }
}
