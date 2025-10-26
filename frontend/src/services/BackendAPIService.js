const API_BASE_URL = 'http://127.0.0.1:8000';

class BackendAPIService {
  static async verifyGigWorkerDocument(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      console.log('Response received from backend:', response);

      if (!response.ok) {
        console.error('Verification failed:', response.statusText);
        const error = await response.json();
        throw new Error(error.detail || 'Verification failed');
      }

      console.log('Document verified successfully');
      console.log(response);

      return await response.json();
    } catch (error) {
      console.error('Backend API Error:', error);
      throw error;
    }
  }
}

export default BackendAPIService;
