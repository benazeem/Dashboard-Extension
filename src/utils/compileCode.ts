import judge0Client from '@/services/judge0Client';

interface SubmitCodeParams {
  language_id: number;
  source_code: string;
  stdin?: string;
  expected_output?: string;
}

interface SubmissionResponse {
  token: string;
}

export async function submitCode(params: SubmitCodeParams): Promise<string> {
  const url = '/submissions?wait=false'; // Don't wait for execution
  const requestBody = {
    language_id: params.language_id,
    source_code: params.source_code,
    stdin: params.stdin,
    redirect_stderr_to_stdout: true,
  };

  try {
    const response = await judge0Client.post<SubmissionResponse>(url, requestBody);
    return response.data.token;
  } catch (error) {
    console.error('Submission error:', error);
    throw new Error('Failed to submit code');
  }
}

export async function getSubmissionResult(token: string): Promise<any> {
  const url = `/submissions/${token}?base64_encoded=false`;
  
  try {
    const response = await judge0Client.get(url);
    return response.data;
  } catch (error) {
    console.error('Result fetch error:', error);
    throw new Error('Failed to fetch result');
  }
}