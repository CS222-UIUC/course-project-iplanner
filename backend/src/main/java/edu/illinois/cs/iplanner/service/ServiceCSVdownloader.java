package edu.illinois.cs.iplanner.service;

import java.io.BufferedInputStream;
import java.io.BufferedWriter;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URL;
import java.net.URLConnection;

public class ServiceCSVdownloader {
    //URL of the folder of csv files
    private final String DataFolderURL = "https://raw.githubusercontent.com/wadefagen/datasets/master/course-catalog/data/";
    //Used to terminate recursive function "downloadCSV" when attempting to use a different form of a term
    private boolean recursion = false;
    //Service Function
    public void downloadCSV(String year, String term, String outputDirectory) throws Exception{
        //Check Invalid Input
        if (year == null || term == null || outputDirectory == null || !outputDirectory.endsWith("/")) {
            System.out.print("Input:\n\tyear: " + year + "\n\tterm: " + term + "\n\toutputDirectory: " + outputDirectory);
            printUsage();
            return;
        }
        //create output file name
        String csvFileName = year + "-" + term + ".csv";
        try {
            //Build connection
            URL url = new URL(DataFolderURL + csvFileName);
            URLConnection connection = url.openConnection();
            //Throws IOE if the connection fails
            connection.connect();
            //Read data from URL and write to output file
            BufferedInputStream bis = new BufferedInputStream(connection.getInputStream());
            String outputFileName = year + "-" + (term.length() == 2 ? term : changeTerm(term)) + ".csv";
            FileOutputStream fos = new FileOutputStream(outputDirectory + outputFileName);
            byte[] buffer = new byte[1024];
            int count = 0;
            while ((count = bis.read(buffer, 0, 1024)) != -1) {
                fos.write(buffer, 0, count);
            }
            fos.close();
            bis.close();
            System.out.println("\nSuccessfully downloaded to " + outputFileName + "\n");
        } catch (IOException ioe) {
            //Handle when connection fails
            //If already tried to reconnect with a different form of the term, exit with instruction printed
            if (recursion) {
                System.out.println("\nFailed to connect to:\n" + ioe.getMessage());
                return;
            }
            //If have not yet attempted to reconnect, try so  
            recursion = true;
            downloadCSV(year, changeTerm(term), outputDirectory);
        } catch (Exception e) {
            System.out.println("\nERROR: DOWNLOAD FAILED\n" + e.getStackTrace());
        } finally {
            //reset the recursion signal for the future runs
            recursion = false;
        }
    }

    //Helper to handler full term and abbreviation
    private String changeTerm(String term) {
        if (term.startsWith("fa")) {
            return term.length() == 2 ? "fall" : "fa";
        }
        if (term.startsWith("sp")) {
            return term.length() == 2 ? "spring" : "sp";
        }
        return null;
    }

    //Instruction to use this service
    private void printUsage() {
        System.out.println("\nExample: \ndownloadCSV(\"yyyy\", \"xx\", \"./dataFile/\");");
    }
}
