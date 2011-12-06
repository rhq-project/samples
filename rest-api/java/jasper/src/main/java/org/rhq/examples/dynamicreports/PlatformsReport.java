/*
 * RHQ Management Platform
 * Copyright (C) 2005-2011 Red Hat, Inc.
 * All rights reserved.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation version 2 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
 */
package org.rhq.examples.dynamicreports;

import java.net.Authenticator;
import java.net.PasswordAuthentication;

import net.sf.dynamicreports.report.base.expression.AbstractValueFormatter;
import net.sf.dynamicreports.report.builder.FieldBuilder;
import net.sf.dynamicreports.report.builder.column.Columns;
import net.sf.dynamicreports.report.builder.column.TextColumnBuilder;
import net.sf.dynamicreports.report.builder.component.Components;
import net.sf.dynamicreports.report.builder.style.StyleBuilder;
import net.sf.dynamicreports.report.builder.style.Styles;
import net.sf.dynamicreports.report.constant.HorizontalAlignment;
import net.sf.dynamicreports.report.definition.ReportParameters;
import net.sf.jasperreports.engine.data.JRXmlDataSource;


import static net.sf.dynamicreports.report.builder.DynamicReports.field;
import static net.sf.dynamicreports.report.builder.DynamicReports.report;

/**
 * Simple report that lists the platforms
 * @author Heiko W. Rupp
 */
public class PlatformsReport {

    public static void main(String[] args) throws Exception {

        if (args.length < 2 ) {
            usage();
            System.exit(1);
        }

        PlatformsReport pReport = new PlatformsReport();
        String server = "localhost";
        if (args.length>2)
            server = args[2];

        pReport.run(server,args[0],args[1]);
    }

    private static void usage() {
        System.out.println("Usage: PlatformsReport <user> <password> [<rhq server>]");
    }

    private void run(String server, String user, String password) throws Exception {

        // Generate and set the authentication callback
        Authenticator myAuth = new MyAuthenticator(user,password);
        Authenticator.setDefault(myAuth);

        // Get the data from the REST api
        JRXmlDataSource dataSource = new JRXmlDataSource("http://" + server + ":7080/rest/1/resource/platforms.xml", "/collection/resource");

        // Get the individual fields to be shown
        FieldBuilder<Integer> idField = field("id", Integer.class)
                .setDescription("resourceId");
        FieldBuilder<String> itemField = field("resourceName", String.class);
        FieldBuilder<String> resourceTypeField = field("typeName", String.class);

        StyleBuilder boldStyle = Styles.style().bold();

        TextColumnBuilder<Integer> idColumn = Columns.column("Resource Id", idField);
        idColumn.setValueFormatter(new IntegerFormatter());

        // create the report
        report()
                .columns(
                        idColumn,
                        Columns.column("Resource Name", itemField),
                        Columns.column("Resource Type", resourceTypeField))
                .title(Components.text("Platforms")
                        .setHorizontalAlignment(HorizontalAlignment.CENTER)
                        .setStyle(boldStyle))
                .pageFooter(Components.pageXofY())
                .setDataSource(dataSource)
                // show it on screen
                .show();
    }

    /**
     * Value formatter that formats integers without any 1000s separator
     */
    private class IntegerFormatter extends AbstractValueFormatter<String,Integer> {
        public String format(Integer value, ReportParameters reportParameters) {
            return String.valueOf(value);
        }
    }

    /**
     * Authenticator that gets called from the HTTP client to
     * authenticate against the REST api.
     */
    private class MyAuthenticator extends Authenticator {

        private String user;
        private String password;

        MyAuthenticator(String user, String password) {
            this.user = user;
            this.password = password;
        }

        @Override
        protected PasswordAuthentication getPasswordAuthentication() {
            return new PasswordAuthentication(user,password.toCharArray());
        }
    }
}
