import axiosInstance from "@/common/services/axios";

export async function getFileAccessLink(fileName: string) {
    const requestSearchParams = new URLSearchParams({
        file_name: fileName
    }).toString()

    const fileLinkResponse = await axiosInstance.get<string>('generate-file-access-url?' + requestSearchParams);
    return fileLinkResponse.data.data
}
