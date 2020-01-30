/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import * as path from 'path';
import {
  CommonDirDirectoryDiffer,
  ConflictDetector
} from '../../../src/conflict';
import { nls } from '../../../src/messages';

describe('Conflict Detection Service', () => {
  it('Should build the source retrieve command', () => {
    const tempPath = path.join('.sfdx', 'tools', 'conflicts');
    const manifestPath = path.join(tempPath, 'package.xml');
    const detector = new ConflictDetector(new CommonDirDirectoryDiffer());

    const sourceRetrieveCommand = detector.buildRetrieveOrgSourceCommand({
      usernameOrAlias: 'MyOrg',
      packageDir: 'force-app',
      manifest: manifestPath
    });

    expect(sourceRetrieveCommand.toCommand()).to.equal(
      `sfdx force:mdapi:retrieve --retrievetargetdir ${tempPath} --unpackaged ${manifestPath} --targetusername MyOrg`
    );

    expect(sourceRetrieveCommand.description).to.equal(
      nls.localize('conflict_detect_retrieve_org_source')
    );
  });

  it('Should build the source convert command', () => {
    const tempPath = path.join('.sfdx', 'tools', 'conflicts');
    const manifestPath = path.join(tempPath, 'package.xml');
    const packagedPath = path.join(tempPath, 'unpackaged');
    const convertedPath = path.join(tempPath, 'converted');

    const detector = new ConflictDetector(new CommonDirDirectoryDiffer());
    const sourceRetrieveCommand = detector.buildMetadataApiConvertOrgSourceCommand(
      {
        usernameOrAlias: 'MyOrg',
        packageDir: 'force-app',
        manifest: manifestPath
      }
    );

    expect(sourceRetrieveCommand.toCommand()).to.equal(
      `sfdx force:mdapi:convert --rootdir ${packagedPath} --outputdir ${convertedPath}`
    );

    expect(sourceRetrieveCommand.description).to.equal(
      nls.localize('conflict_detect_convert_org_source')
    );
  });
});
