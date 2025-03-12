interface BaseRecord {
    // 假设 BaseRecord 包含这些字段，根据实际情况调整
    id?: number;
    created_at?: string;
    updated_at?: string;
}

interface VscExt extends BaseRecord {
    name: string;
    displayName: string;
    status: number;
}

interface VscExtVersion extends BaseRecord {
    displayName: string;
    version: string;
    description: string;
    publisher: string;
    vscodeVersion: string;
    repositoryUrl?: string;
    readmeContent?: string;

    iconFileUrl?: string;
    vsixFileUrl?: string;
}

interface CreateVscExtVersion extends VscExtVersion {
    name: string;
    extensionId: number;
    iconFile: File;
    vsixFile: File;
}

interface CreateVscExt extends VscExt, CreateVscExtVersion {
    // 根据实际情况调整，这里假设没有额外字段
}

interface VscExtVersionRecord extends VscExtVersion {
    iconFilePath?: string;
    vsixFilePath?: string;
}

interface VscExtRecord extends VscExt, VscExtVersionRecord {
    downloadTimes: number;
    // 根据实际情况调整，这里假设没有额外字段
}

interface VscExtListParam {
    displayName?: string;
}

interface VscExtListRecord {
    list: VscExtRecord[];
}

interface VscExtVersionListRecord {
    list: VscExtVersionRecord[];
}

interface VscExtStatus extends IdParam {
    status: 0 | 1 | 2; // 假设状态值范围为 0 到 2
}

interface IdParam {
    id: number;
}