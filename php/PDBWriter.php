<?php

	
	
    /**
     * 
     */
    class PDBWriter {
        
		var $pdb;
		
        function __construct( $fileName, $path = NULL, $cover = true ) {
            
			if($path) $this->checkdirLevels( $path );
			
			if($path) $fileName = $path . "/" . $fileName;
			
			if( file_exists($fileName) ) @unlink ( $fileName );
			
			$this->pdb = fopen( $fileName, "w+" );
			
			return $this;
			
        }
		
		public function write( $str, $newline = false ){
			
			fputs($this->pdb,$str);
			
			if( $newline ) fputs( $this->pdb,"\n" );
			
			return $this;
			
		}
		
		public function save(  ){
			
			fclose( $this->pdb );
			
			return $this;
			
		}
		
		private function createdir($dirname, $mode=0777, $recursive = false){
			if ( version_compare(PHP_VERSION, '5.0.0', '>=') ) return mkdir($dirname, $mode, $recursive);
			 
			if ( !$recursive ) {
				$ret = mkdir($dirname, $mode);
				if($ret) chmod($dirname, $mode);
				return $ret;
			}
			
			return is_dir($dirname) or ($this->createdir(dirname($dirname), $mode, true) and mkdir($dirname, $mode));
		}
	
		//解析路径，自动建立
		private function checkdirLevels( $dirname ){
			$fileDirs = explode('/', $dirname);
			$thisdir = "";
			foreach($fileDirs as $dirs){
				$thisdir .=$dirs;
				if (!file_exists($thisdir)) $this->createdir($thisdir);
				$thisdir .="/";
			}
		}
			
		// 删除目录
		private function delfolder($dirname, $flag = true){
			$handle = @opendir($dirname);
			while ($file = @readdir($handle)){
				if($file != '.' && $file != '..'){
					if (is_dir($dirname . DIRECTORY_SEPARATOR . $file)) $this->delfolder($dirname . DIRECTORY_SEPARATOR . $file, true);
					else @unlink($dirname . DIRECTORY_SEPARATOR . $file);
				}
			}
			@savedir($handle);
			if ($flag) @rmdir($dirname);
		}
		
    };
    
	/**
	 * 
	 */
	
	
	
	

?>