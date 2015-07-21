<?php

    if( !isset($_POST["fileName"]) || isset($_POST["fileName"]) == null ){
    	
		echo "-1";
		return;
		
    }
	
	$fileName= $_POST["fileName"];
	
	$filePath= $_POST["filePath"];
	
	
	$content = $_POST["content"];
	
	
	require_once 'PDBWriter.php';
	
	
	$writer = new PDBWriter( $fileName, $filePath );
	
	$writer->write( $content )->save();
	
	echo "1";
	
	return;
	
?>