/**
 * multipart/form-data istek gövdesi.
 *
 * Düz veri (metin alanları + dosya parçaları) tutar; `fetch`'e verilecek `FormData`'yı
 * üretir. Dosya yükleyen endpoint'ler için `BaseResource.sendMultipart` ile kullanılır.
 *
 * Not: Global `FormData` ve `Blob` (Node 18+ / modern tarayıcı) gerektirir.
 */
export class MultipartBody {
  private readonly fields: Array<{ name: string; value: string }> = [];
  private readonly files: Array<{ name: string; fileName: string; content: Uint8Array; contentType: string }> = [];

  /** Metin form alanı ekler. */
  addField(name: string, value: string): this {
    this.fields.push({ name, value });
    return this;
  }

  /** Dosya parçası ekler. */
  addFile(name: string, fileName: string, content: Uint8Array, contentType = 'application/octet-stream'): this {
    this.files.push({ name, fileName, content, contentType });
    return this;
  }

  /** Parçalardan bir `FormData` üretir (Content-Type/boundary'yi `fetch` ayarlar). */
  toFormData(): FormData {
    const form = new FormData();
    for (const f of this.fields) {
      form.append(f.name, f.value);
    }
    for (const file of this.files) {
      const blob = new Blob([file.content], { type: file.contentType });
      form.append(file.name, blob, file.fileName);
    }
    return form;
  }
}
