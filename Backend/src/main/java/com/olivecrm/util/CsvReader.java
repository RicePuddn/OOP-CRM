package com.olivecrm.util;

import org.springframework.stereotype.Component;
import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

@Component
public class CsvReader {

    public List<String[]> readCsv(InputStream inputStream) {
        List<String[]> csvData = new ArrayList<>();

        try (Scanner scanner = new Scanner(inputStream)) {
            while (scanner.hasNextLine()) {
                csvData.add(scanner.nextLine().split(","));
            }
        }

        return csvData;
    }

    public List<String[]> readCsvFromFile(String filePath) {
        List<String[]> csvData = new ArrayList<>();

        try (Scanner scanner = new Scanner(new File(filePath))) {
            while (scanner.hasNextLine()) {
                csvData.add(scanner.nextLine().split(","));
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        return csvData;
    }
}