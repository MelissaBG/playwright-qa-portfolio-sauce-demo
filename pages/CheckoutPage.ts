import { Page, Locator, expect } from '@playwright/test'; 
export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly errorMessage: Locator;
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.errorMessage = page.getByTestId('error');
    this.completeHeader = page.getByTestId('complete-header');
  }

  private async typeInto(input: Locator, value: string) {
    await input.clear();
    if (value) {
      await input.pressSequentially(value);
    }
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await expect(async () => {
      await this.typeInto(this.firstNameInput, firstName);
      await this.typeInto(this.lastNameInput, lastName);
      await this.typeInto(this.postalCodeInput, postalCode);
      await expect(this.firstNameInput).toHaveValue(firstName, { timeout: 500 });
      await expect(this.lastNameInput).toHaveValue(lastName, { timeout: 500 });
      await expect(this.postalCodeInput).toHaveValue(postalCode, { timeout: 500 });
    }).toPass({ timeout: 10000 });
  }

  async continueCheckout() {
    await this.continueButton.click();
  }

  async finish() {
    await this.finishButton.click();
  }
}