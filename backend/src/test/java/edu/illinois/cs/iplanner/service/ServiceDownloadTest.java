package edu.illinois.cs.iplanner.service;

public class ServiceDownloadTest {
    public static void main(String[] args) throws Exception {
        ServiceCSVdownloader downloader = new ServiceCSVdownloader();
        String output = "./backend/src/test/java/edu/illinois/cs/iplanner/data/csvDownload/";
        //the loop below should not throw any exception
        //test downloadCSV can download to certain directory
        for (int i = 2017; i < 2024; i++) {
            try {
                System.out.println("Try to download year " + i + " sp");
                downloader.downloadCSV(Integer.toString(i), "sp", output);
            } catch (Exception e) {
                assert false : "spring " + i + "failed to download";
            }
            try {
                System.out.println("Try to download year " + i + " fa");
                downloader.downloadCSV(Integer.toString(i), "fa", output);
            } catch (Exception e) {
                assert false : "fall " + i + "failed to download";
            }
        }
        //test downloadCSV won't crash if input is invalid
        try {
            downloader.downloadCSV("2021", "x", output);
            downloader.downloadCSV("2021", "su", output);
            downloader.downloadCSV("2021", "winter", output);
            assert false : "Can not handle invalid term";
        } catch (Exception e) {
            assert true;
        }
        try {
            downloader.downloadCSV("2025", "spring", output);
            downloader.downloadCSV("1984", "fa", output);
            assert false : "Can not handle invalid year";
        } catch (Exception e) {
            assert true;
        }
        System.out.println("\n\n===================================\n===\tALL TESTS PASSED\t===\n===================================");
    }
}
